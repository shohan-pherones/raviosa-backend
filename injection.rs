use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use hyper::{Body, Request, Response, Server, service::{make_service_fn, service_fn}};
use std::sync::{Arc, Mutex};
use tokio::sync::Semaphore;

pub fn get_env_var(key: &str) -> String {
    std::env::var(key).expect("Environment variable not found")
}

async fn handle_request(req: Request<Body>, sem: Arc<Semaphore>) -> Result<Response<Body>, hyper::Error> {
    let _permit = sem.acquire().await.unwrap();
    let secret = get_env_var("SERVER_SECRET");
    let injection_key = get_env_var("INJECTION_KEY");

    if req.headers().get("x-secret").map(|val| val == secret).unwrap_or(false) {
        Ok(Response::new(Body::from(format!("Secure Proxy Injected: {}", injection_key))))
    } else {
        Ok(Response::builder().status(403).body(Body::from("Forbidden")).unwrap())
    }
}

#[tokio::main]
async fn main() {
    let port: u16 = get_env_var("PORT").parse().unwrap_or(4000);
    let ip: IpAddr = get_env_var("IP").parse().unwrap_or(IpAddr::V4(Ipv4Addr::LOCALHOST));
    let addr = SocketAddr::new(ip, port);

    let sem = Arc::new(Semaphore::new(50));

    let make_service = make_service_fn(move |_| {
        let sem_clone = Arc::clone(&sem);
        async move { Ok::<_, hyper::Error>(service_fn(move |req| handle_request(req, Arc::clone(&sem_clone)))) }
    });

    let server = Server::bind(&addr).serve(make_service);

    if let Err(e) = server.await {
        eprintln!("Server error: {}", e);
    }
}