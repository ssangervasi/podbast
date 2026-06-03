#![deny(warnings)]

use log::debug;
use std::env;
use warp::Filter;

/// Adapted from https://github.com/seanmonstar/warp/blob/master/converts/todos.rs
///
/// Routes:
///
/// - `GET /info: Return context info
/// - `POST /echo`: Echo body
///
/// - `GET /store`: Read `data/latest`
/// - `POST /store`: Write `data/latest`
#[tokio::main]
async fn main() {
    let port: u16 = match env::var_os("STORS_PORT") {
        Some(s) => s.to_str().unwrap().parse().unwrap(),
        _ => 3030,
    };
    pretty_env_logger::init();

    let context = models::context();

    let api = filters::combine(context);

    let routes = api.with(warp::log("stors"));

    debug!("Up");
    warp::serve(routes).run(([127, 0, 0, 1], port)).await;
    debug!("Down");
}

mod filters {
    use std::collections::HashMap;

    use super::handlers;
    use super::models::{Context, HandlerOptions};
    use warp::Filter;

    pub fn combine(
        context: Context,
    ) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
        info_get(context.clone()).or(echo_post(context.clone()))
    }

    /// GET /info
    pub fn info_get(
        context: Context,
    ) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
        warp::path!("info")
            .and(with_context(context))
            .and_then(handlers::info_get)
    }

    pub fn echo_post(
        context: Context,
    ) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
        warp::path!("echo")
            .and(with_context(context))
            .and(with_options())
            .and(warp::body::bytes())
            .and_then(handlers::echo_post)
    }

    fn with_context(
        context: Context,
    ) -> impl Filter<Extract = (Context,), Error = std::convert::Infallible> + Clone {
        warp::any().map(move || context.clone())
    }

    fn with_options() -> impl Filter<Extract = (HandlerOptions,), Error = warp::Rejection> + Clone {
        warp::any()
            .and(warp::query::<HashMap<String, String>>())
            .map(|qmap: HashMap<String, String>| HandlerOptions {
                convert: qmap
                    .get("convert")
                    .unwrap_or(&"".to_string())
                    .parse()
                    .unwrap_or("".to_string()),
            })
    }
}
mod handlers {
    use super::models::{Context, HandlerOptions};
    use std::convert::Infallible;
    // use warp::http::StatusCode;

    pub async fn info_get(context: Context) -> Result<impl warp::Reply, Infallible> {
        let context_inner = context.lock().await;
        Ok(format!("store_count = {}", context_inner.store_count))
    }

    pub async fn echo_post(
        _context: Context,
        handler_options: HandlerOptions,
        body: bytes::Bytes,
    ) -> Result<impl warp::Reply, Infallible> {
        let mut s = String::from_utf8_lossy(&body);

        if handler_options.convert == "CAPS" {
            s = s.to_uppercase().into();
        }

        Ok(format!("\nGotten\n{}\n", s))
    }

    // pub async fn create_todo(create: Todo, db: Db) -> Result<impl warp::Reply, Infallible> {
    //     log::debug!("create_todo: {:?}", create);

    //     let mut vec = db.lock().await;

    //     for todo in vec.iter() {
    //         if todo.id == create.id {
    //             log::debug!("    -> id already exists: {}", create.id);
    //             // Todo with id already exists, return `400 BadRequest`.
    //             return Ok(StatusCode::BAD_REQUEST);
    //         }
    //     }

    //     // No existing Todo with id, so insert and return `201 Created`.
    //     vec.push(create);

    //     Ok(StatusCode::CREATED)
    // }
}

mod models {
    // use serde_derive::{Deserialize, Serialize};
    use std::sync::Arc;
    use tokio::sync::Mutex;

    pub type Context = Arc<Mutex<ContextInner>>;

    pub fn context() -> Context {
        Arc::new(Mutex::new(ContextInner { store_count: 0 }))
    }

    #[derive(Debug, Clone)]
    pub struct ContextInner {
        pub store_count: u32,
    }

    // #[derive(Debug, Deserialize)]
    pub struct HandlerOptions {
        pub convert: String,
    }
}

// #[cfg(test)]
// mod tests {
//     use warp::http::StatusCode;
//     use warp::test::request;

//     use super::{
//         filters,
//         models::{self, Todo},
//     };

//     #[tokio::test]
//     async fn test_post() {
//         let db = models::blank_db();
//         let api = filters::todos(db);

//         let resp = request()
//             .method("POST")
//             .path("/todos")
//             .json(&todo1())
//             .reply(&api)
//             .await;

//         assert_eq!(resp.status(), StatusCode::CREATED);
//     }

//     #[tokio::test]
//     async fn test_post_conflict() {
//         let db = models::blank_db();
//         db.lock().await.push(todo1());
//         let api = filters::todos(db);

//         let resp = request()
//             .method("POST")
//             .path("/todos")
//             .json(&todo1())
//             .reply(&api)
//             .await;

//         assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
//     }

//     #[tokio::test]
//     async fn test_put_unknown() {
//         let _ = pretty_env_logger::try_init();
//         let db = models::blank_db();
//         let api = filters::todos(db);

//         let resp = request()
//             .method("PUT")
//             .path("/todos/1")
//             .header("authorization", "Bearer admin")
//             .json(&todo1())
//             .reply(&api)
//             .await;

//         assert_eq!(resp.status(), StatusCode::NOT_FOUND);
//     }

//     fn todo1() -> Todo {
//         Todo {
//             id: 1,
//             text: "test 1".into(),
//             completed: false,
//         }
//     }
// }
