terraform {
  backend "s3" {
    bucket         = "my-terraform-todo-states"
    key            = "todo/terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
