up:
	docker compose down 
	docker compose -f docker-compose-dev.yml up -d --remove-orphans --force-recreate
	
prod:
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.yml up referral-system-api-prod  -d --remove-orphans --force-recreate
	
reset:
	docker compose down -v --remove-orphans
	docker compose up referral-system-api --build -d --remove-orphans --force-recreate

all:
	docker compose down 
	docker compose up   -d --remove-orphans --force-recreate


logs:
	docker logs  -f ajke-api

restart:
	docker compose restart

down:
	docker compose down