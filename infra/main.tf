provider "aws" {
  region = var.region
}

# -----------------------------
# Lambda Package
# -----------------------------
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend"
  output_path = "${path.module}/lambda.zip"
}

# -----------------------------
# Lambda Function
# -----------------------------
resource "aws_lambda_function" "backend" {
  function_name = var.project_name
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      EVENTS_TABLE    = aws_dynamodb_table.todo_tasks.name
      BUCKET_NAME = "todolist-bucket"
    }
  }
}

# -----------------------------
# API Gateway (HTTP API)
# -----------------------------
resource "aws_apigatewayv2_api" "api" {
  name          = "todolist-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.backend.invoke_arn
  payload_format_version = "2.0"
}

# -------- Routes --------

resource "aws_apigatewayv2_route" "create_task" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /tasks"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "get_tasks" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /tasks"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "get_task" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /tasks/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "update_task" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "PUT /tasks/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "delete_task" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "DELETE /tasks/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# -----------------------------
# Stage
# -----------------------------
resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "prod"
  auto_deploy = true
}

# -----------------------------
# Lambda Permission
# -----------------------------
resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
  
}
# -----------------------------
# DynamoDB
# -----------------------------
resource "aws_dynamodb_table" "todo_tasks" {
  name         = "TodoTasks"
  billing_mode = "PAY_PER_REQUEST"   # auto-scale, free-tier friendly

  hash_key = "taskId"

  attribute {
    name = "taskId"
    type = "S"
  }

  tags = {
    Environment = "dev"
    Project     = "todo-app"
  }
}
