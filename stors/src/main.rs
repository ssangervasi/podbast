use log::debug;
use warp::Filter;

#[tokio::main]
async fn main() {
    pretty_env_logger::init();

    debug!("horse");

    let dbglog = warp::log("example::api");
    let readme = warp::get()
        .and(warp::path::end())
        .and(warp::fs::file("./README.md"))
        .with(dbglog);

    // dir already requires GET...
    let examples = warp::path("ex").and(warp::fs::dir("./examples/"));

    // GET / => README.md
    // GET /ex/... => ./examples/..
    let routes = readme.or(examples);

    warp::serve(routes).run(([0, 0, 0, 0], 3030)).await;
}
