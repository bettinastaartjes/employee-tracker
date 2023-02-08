
-- insert names of departments into department table
INSERT INTO department
  (name)
VALUES
  ('Engineering'),
  ('Sales'),
  ('Finance'),
  ('Legal');

-- insert roles of employee info into role table
INSERT INTO role
  (title, salary, departments_id)
VALUES
  ('Software Engineer', 85000, 1),
  ('Salesperson', 75000, 2),
  ('Accountant', 125000, 3),
  ('Lawyer', 200000, 4);

-- isnert employee info into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Bettina', 'Staartjes', 1, NULL),
  ('Sofia', 'Martinez', 2, 3),
  ('Regina', 'Ramirez', 3, 1),
  ('Lisa', 'Watkins', 4, 5);