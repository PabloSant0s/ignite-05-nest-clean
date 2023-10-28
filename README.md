### Generate Jwt RS256 Windows
- openssl genpkey -algorithm RSA -out private_key.pem
- openssl rsa -pubout -in private_key.pem -out public_key.pem

- openssl base64 -in private_key.pem > private_key_base64.txt
- openssl base64 -in public_key.pem > public_key_base64.txt
