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
  value       = aws_dynamodb_table.events.name
}

output "aws_region" {
  description = "AWS region where resources are deployed"
  value       = var.region
}
