use std::{fs, path::Path};

use log::debug;
use warp::{
    Filter, Rejection, Reply,
    filters::{BoxedFilter, body::content_length_limit},
};

// pub fn index_filter() -> impl Filter<Extract = (&'static str,), Error = Rejection> + Clone {
// fn becho() -> impl Filter<Extract = (&'static str,), Error = Rejection> + Clone {
fn becho() -> BoxedFilter<(impl Reply,)> {
    let path = warp::path("becho");

    let get = path.and(warp::get()).map(|| "Gotten\n");

    let post = path
        .and(warp::post())
        .and(content_length_limit(100_000))
        .and(warp::body::bytes())
        .map(|body: bytes::Bytes| {
            let mut bv: Vec<u8> = Vec::new();
            body.iter().for_each(|byte| {
                debug!("byte: {}", byte);
                bv.push(*byte);
            });

            let s = String::from_utf8_lossy(&bv);
            // let s: &str = bv.into();

            format!("\nGotten\n{}\n", s)
        });

    let routes = get.or(post);
    routes.boxed()
}

fn store() -> BoxedFilter<(impl Reply,)> {
    let route_path = warp::path("store");

    let get = route_path.and(warp::get()).map(|| {
        let f_path = Path::new("./data/latest");
        let s = fs::read_to_string(f_path).expect("file not found");
        s
    });

    let post = route_path
        .and(warp::post())
        .and(content_length_limit(100_000))
        .and(warp::body::bytes())
        .map(|body: bytes::Bytes| {
            let mut bv: Vec<u8> = Vec::new();
            body.iter().for_each(|byte| {
                debug!("byte: {}", byte);
                bv.push(*byte);
            });

            let s = String::from_utf8_lossy(&bv);
            // let s: &str = bv.into();

            format!("\nGotten\n{}\n", s)
        });

    let routes = get.or(post);
    routes.boxed()
}

#[tokio::main]
async fn main() {
    pretty_env_logger::init();

    debug!("Up");

    let debug_log = warp::log("debug");
    let routes = becho().or(store()).with(debug_log);

    warp::serve(routes).run(([0, 0, 0, 0], 3030)).await;

    debug!("Down");
}
