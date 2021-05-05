DROP DATABASE IF EXISTS contentManagementSystem_db;

CREATE DATABASE contentManagementSystem_db;

USE contentManagementSystem_db;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  NAME VARCHAR(30),
  PRIMARY KEY (id)

);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY(id),
  FOREIGN KEY (department_id) REFERENCES Department(id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES Role(id),
  FOREIGN KEY (manager_id) REFERENCES Employee(id)
);