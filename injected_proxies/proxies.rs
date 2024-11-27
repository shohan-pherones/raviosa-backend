pub fn secure_proxy_config() -> String {
    let domain = std::env::var("DOMAIN").expect("DOMAIN not set");
    let protocol = std::env::var("PROTOCOL").unwrap_or("http".to_string());
    let reverse_proxy_port = std::env::var("REVERSE_PROXY_PORT").unwrap_or("80".to_string());
    format!("{}://{}:{}/proxy", protocol, domain, reverse_proxy_port)
}