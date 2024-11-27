use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tokio::sync::Notify;

pub struct ThrottleBus {
    requests: Mutex<HashMap<String, Vec<Instant>>>,
    limit: usize,
    window: Duration,
    notify: Arc<Notify>,
}

impl ThrottleBus {
    pub fn new(limit: usize, window: Duration) -> Self {
        Self {
            requests: Mutex::new(HashMap::new()),
            limit,
            window,
            notify: Arc::new(Notify::new()),
        }
    }

    pub fn allow_request(&self, client_id: &str) -> bool {
        let mut requests = self.requests.lock().unwrap();
        let now = Instant::now();
        let client_requests = requests.entry(client_id.to_string()).or_insert_with(Vec::new);
        client_requests.retain(|&t| now.duration_since(t) < self.window);
        if client_requests.len() < self.limit {
            client_requests.push(now);
            true
        } else {
            false
        }
    }

    pub fn cleanup(&self) {
        let mut requests = self.requests.lock().unwrap();
        let now = Instant::now();
        requests.retain(|_, times| {
            times.retain(|&t| now.duration_since(t) < self.window);
            !times.is_empty()
        });
    }

    pub async fn block_until_available(&self, client_id: &str) {
        loop {
            if self.allow_request(client_id) {
                return;
            }
            self.notify.notified().await;
        }
    }

    pub fn notify_all(&self) {
        self.notify.notify_waiters();
    }

    pub fn get_request_count(&self, client_id: &str) -> usize {
        self.requests
            .lock()
            .unwrap()
            .get(client_id)
            .map_or(0, |requests| requests.len())
    }
}

pub fn create_throttle_bus(limit: usize, window_secs: u64) -> Arc<ThrottleBus> {
    Arc::new(ThrottleBus::new(limit, Duration::from_secs(window_secs)))
}

pub async fn simulate_request(bus: Arc<ThrottleBus>, client_id: &str) -> bool {
    if bus.allow_request(client_id) {
        bus.notify_all();
        true
    } else {
        bus.block_until_available(client_id).await;
        false
    }
}