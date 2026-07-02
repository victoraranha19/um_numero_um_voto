CREATE TABLE IF NOT EXISTS cotas (
  id SERIAL PRIMARY KEY,
  presidente VARCHAR(255) NOT NULL,
  id_usuario INTEGER,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);