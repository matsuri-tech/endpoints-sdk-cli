use crate::model::endpoint::Endpoint;

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct Param {
    name: String,
    example: Option<String>,
    param_type: String,
}

fn detect_param_type(example: &str) -> String {
    match example.parse::<i32>() {
        Ok(_) => "number".to_string(),
        Err(_) => "string".to_string(),
    }
}

#[test]
fn test_detect_param_type() {
    assert_eq!(detect_param_type("333"), "number");
    assert_eq!(detect_param_type("123456789"), "number");
    assert_eq!(detect_param_type("123,456,789"), "string");
    assert_eq!(detect_param_type("20220522"), "number");
    assert_eq!(detect_param_type("2022-05-22"), "string");
    assert_eq!(detect_param_type("hello, world"), "string");
}

fn make_query_params(query_params_str: String) -> Vec<Param> {
    query_params_str
        .split('&')
        .map(|s| -> Param {
            let s = s.split('=').collect::<Vec<_>>();
            let example = if s.len() > 1 { Some(s[1]) } else { None };
            Param {
                name: s[0].to_string(),
                example: { example.map(|example| example.to_string()) },
                param_type: match example {
                    Some(example) => detect_param_type(example),
                    None => "string".to_string(),
                },
            }
        })
        .collect::<Vec<Param>>()
}

#[test]
fn test_make_query_params() {
    let params = make_query_params("location=ja&age=24&active".to_string());
    assert_eq!(params[0].name, "location");
    assert_eq!(params[0].example, Some("ja".to_string()));
    assert_eq!(params[0].param_type, "string");
    assert_eq!(params[1].name, "age");
    assert_eq!(params[1].example, Some("24".to_string()));
    assert_eq!(params[1].param_type, "number");
    assert_eq!(params[2].name, "active");
    assert_eq!(params[2].example, None);
    assert_eq!(params[2].param_type, "string");
}

fn make_path_params(path: String) -> Vec<Param> {
    path.split('/')
        .filter(|s| s.starts_with(':'))
        .map(|s| -> Param {
            Param {
                name: s[1..].to_string(),
                example: None,
                param_type: "string".to_string(),
            }
        })
        .collect::<Vec<Param>>()
}
#[test]
fn test_make_path_params() {
    let params = make_path_params("/api/v1/users/:id/items/:itemId".to_string());
    assert_eq!(params[0].name, "id");
    assert_eq!(params[0].example, None);
    assert_eq!(params[0].param_type, "string");
    assert_eq!(params[1].name, "itemId");
    assert_eq!(params[1].example, None);
    assert_eq!(params[1].param_type, "string");
}

pub fn make_endpoint(name: String, endpoint: Endpoint) -> String {
    let pv = endpoint.path.split('?').collect::<Vec<_>>();
    let endpoint_path = pv[0].to_string();
    let query_params = {
        if pv.len() > 1 {
            make_query_params(pv[1].to_string())
        } else {
            vec![]
        }
    };
    let path_params = make_path_params(endpoint_path.clone());

    let mut param_names: Vec<String> = Vec::new();
    let mut query_param_names: Vec<String> = Vec::new();
    let mut params: Vec<Param> = Vec::new();
    for param in query_params.clone() {
        if param_names.contains(&param.name) {
            continue;
        }
        param_names.push(param.name.clone());
        query_param_names.push(param.name.clone());
        params.push(param);
    }

    let mut path_param_names: Vec<String> = Vec::new();
    for param in path_params.clone() {
        if param_names.contains(&param.name) {
            continue;
        }
        param_names.push(param.name.clone());
        path_param_names.push(param.name.clone());
        params.push(param);
    }
    let description = endpoint.desc;
    let query_params_comment = if !query_params.is_empty() {
        query_params
            .iter()
            .map(|param| {
                format!(
                    "@param {{{}}} {} {}",
                    param.param_type,
                    param.name,
                    param.example.clone().unwrap_or_default()
                )
            })
            .collect::<Vec<_>>()
            .join("\n * ")
    } else {
        "".to_string()
    };
    let parameters = param_names.join(", ");
    let parameter_types = params
        .iter()
        .map(|param| {
            format!(
                "{}{}: {}",
                param.name,
                if path_param_names.contains(&param.name) {
                    "".to_string()
                } else {
                    "?".to_string()
                },
                param.param_type
            )
        })
        .collect::<Vec<_>>()
        .join(", ");
    let query_param_names_str = query_param_names.join(", ");
    let path_template = {
        let mut path_template = endpoint_path;
        for param in path_params {
            path_template =
                path_template.replace(&format!(":{}", param.name), &format!("${{{}}}", param.name));
        }
        path_template
    };
    let mut result = format!(
        r#"
/**
 * {description}
 * {query_params_comment}
 */
export const {name}=({{{parameters}}}:{{{parameter_types}}})=>{{
    const __root = root();
    const __queries = Object.entries({{{query_param_names_str}}})
        .filter(([_, value])=> {{
            return value !== undefined
        }})
        .map(([key, value])=> {{
            return `${{key}}=${{value}}`
        }}).join("&");
    const __path = `${{__root}}{path_template}`;
    return __queries ? `${{__path}}?${{__queries}}` : __path;
}};
"#
    );
    if let Some(method) = endpoint.method {
        result.push_str(&format!(
            r#"
{name}.method = "{method}" as const;
"#
        ));
    }
    result
}

#[test]
fn test_make_endpoint() {
    let result = make_endpoint(
        "health_check".to_string(),
        Endpoint {
            path: "/:id/:date/?ee&hoge=22&id=hoge".to_string(),
            desc: "This is health check".to_string(),
            method: None,
        },
    );
    assert_eq!(
        result,
        r#"
/**
 * This is health check
 * @param {string} ee 
 * @param {number} hoge 22
 * @param {string} id hoge
 */
export const health_check=({ee, hoge, id, date}:{ee?: string, hoge?: number, id?: string, date: string})=>{
    const __root = root();
    const __queries = Object.entries({ee, hoge, id})
        .filter(([_, value])=> {
            return value !== undefined
        })
        .map(([key, value])=> {
            return `${key}=${value}`
        }).join("&");
    const __path = `${__root}/${id}/${date}/`;
    return __queries ? `${__path}?${__queries}` : __path;
};
"#
    );
}

#[test]
fn test_make_endpoint_with_method() {
    let result = make_endpoint(
        "health_check".to_string(),
        Endpoint {
            path: "/:id/:date/?ee&hoge=22&id=hoge".to_string(),
            desc: "This is health check".to_string(),
            method: Some("GET".to_string()),
        },
    );
    assert_eq!(
        result,
        r#"
/**
 * This is health check
 * @param {string} ee 
 * @param {number} hoge 22
 * @param {string} id hoge
 */
export const health_check=({ee, hoge, id, date}:{ee?: string, hoge?: number, id?: string, date: string})=>{
    const __root = root();
    const __queries = Object.entries({ee, hoge, id})
        .filter(([_, value])=> {
            return value !== undefined
        })
        .map(([key, value])=> {
            return `${key}=${value}`
        }).join("&");
    const __path = `${__root}/${id}/${date}/`;
    return __queries ? `${__path}?${__queries}` : __path;
};

health_check.method = "GET" as const;
"#
    );
}
