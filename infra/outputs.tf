output "api_gateway_url" {
  description = "Base URL of the API Gateway"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.backend.function_name
}

output "lambda_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.backend.arn
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.todo_tasks.name
}

output "aws_region" {
  description = "AWS region where resources are deployed"
  value       = var.region
}

output "access_key_id" {
  value = aws_iam_access_key.github_frontend_access_key.id
}

output "secret_access_key" {
  value     = aws_iam_access_key.github_frontend_access_key.secret
  sensitive = true
}

output "bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}
