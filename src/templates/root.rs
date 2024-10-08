use crate::model::endpoint::EnvList;
use std::collections::HashMap;

fn normalize_name(n: &str) -> &str {
    match n {
        "dev" => "development",
        "prod" => "production",
        _ => n,
    }
}

fn normalize_url(u: &str) -> String {
    if let Some(stripped) = u.strip_suffix('/') {
        stripped.to_string()
    } else {
        u.to_string()
    }
}

pub fn make_root(
    environment_identifier: String,
    env: EnvList,
    overrides: Option<EnvList>,
) -> String {
    let mut env: Vec<(&String, &String)> = env.iter().collect();
    env.sort_by(|(a, _), (b, _)| a.cmp(b));

    let content: String = env
        .iter()
        .map(|(n, u)| {
            format!(
                r#"
    if ({} == "{}") {{
        __root = '{}';
    }}
    "#,
                environment_identifier,
                normalize_name(n),
                overrides
                    .as_ref()
                    .and_then(|o| o.get(&**n))
                    .map(|u| normalize_url(u))
                    .unwrap_or_else(|| normalize_url(u))
            )
        })
        .collect::<Vec<String>>()
        .join("");

    format!(
        r#"
/**
 * A function that returns the URL part common to the endpoints.
 */
export const root = () => {{
    let __root = "";
    {}
    return __root
}}
"#,
        content
    )
}

#[test]
fn test_make_root() {
    let result = make_root(
        "process.env.NODE_ENV".to_string(),
        HashMap::from([
            ("dev".to_string(), "http://localhost:3000".to_string()),
            ("prod".to_string(), "https://example.com".to_string()),
        ]),
        None,
    );
    assert_eq!(
        result,
        r#"
/**
 * A function that returns the URL part common to the endpoints.
 */
export const root = () => {
    let __root = "";
    
    if (process.env.NODE_ENV == "development") {
        __root = 'http://localhost:3000';
    }
    
    if (process.env.NODE_ENV == "production") {
        __root = 'https://example.com';
    }
    
    return __root
}
"#
    );
}

#[test]
fn test_make_root_with_overrides() {
    let result = make_root(
        "process.env.NODE_ENV".to_string(),
        HashMap::from([
            ("dev".to_string(), "http://localhost:3000".to_string()),
            ("prod".to_string(), "https://example.com".to_string()),
        ]),
        Some(HashMap::from([
            ("dev".to_string(), "http://localhost:3001".to_string()),
            ("prod".to_string(), "https://example.org".to_string()),
        ])),
    );
    assert_eq!(
        result,
        r#"
/**
 * A function that returns the URL part common to the endpoints.
 */
export const root = () => {
    let __root = "";
    
    if (process.env.NODE_ENV == "development") {
        __root = 'http://localhost:3001';
    }
    
    if (process.env.NODE_ENV == "production") {
        __root = 'https://example.org';
    }
    
    return __root
}
"#
    );
}
