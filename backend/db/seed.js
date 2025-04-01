const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  user: "user",
  host: "localhost",
  database: "comments",
  password: "password",
  port: 5433,
});

async function seedDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        likes INTEGER DEFAULT 0,
        image TEXT
      );
    `);

    const jsonData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/comments.json"), "utf-8")
    );

    for (const comment of jsonData.comments) {
      await pool.query(
        "INSERT INTO comments (author, text, created_at, likes, image) VALUES ($1, $2, $3, $4, $5)",
        [
          comment.author,
          comment.text,
          new Date(comment.date),
          comment.likes || 0,
          comment.image || null,
        ]
      );
    }

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
