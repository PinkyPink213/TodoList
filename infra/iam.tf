# -----------------------------
# IAM Role for Lambda
# -----------------------------

resource "aws_iam_role" "lambda_role" {
  name = "lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "ddb" {
  name = "lambda-dynamodb"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["dynamodb:*"]
      Resource = "*"
    }]
  })
}

# -----------------------------
# IAM Role for S3
# -----------------------------
resource "aws_iam_user" "github_frontend" {
  name = "github-frontend-deploy"
}

resource "aws_iam_user_policy" "github_frontend_policy" {
  name = "github-frontend-s3-policy"
  user = aws_iam_user.github_frontend.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"]
        Resource = [
          aws_s3_bucket.frontend.arn,
          "${aws_s3_bucket.frontend.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_access_key" "github_frontend_access_key" {
  user = aws_iam_user.github_frontend.name
}
