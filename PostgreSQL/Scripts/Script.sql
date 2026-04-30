CREATE TABLE budget (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    category_id INT REFERENCES category(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    period VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);