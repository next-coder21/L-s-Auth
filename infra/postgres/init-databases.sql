-- L's - Auth Database Initialization Script
-- Creates separate databases for L's - Auth product metadata and Keycloak identity engine

SELECT 'CREATE DATABASE liji_identity'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'liji_identity')\gexec

SELECT 'CREATE DATABASE liji_keycloak'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'liji_keycloak')\gexec

