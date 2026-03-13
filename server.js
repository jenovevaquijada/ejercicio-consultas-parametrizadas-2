const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db-demo-01', 
    password: 'm0ch1', 
    port: 5432,
});

// 1. GET
app.get('/clientes', async (req, res) => {
    const { rut, edad, edadMin, edadMax, nombre } = req.query;

    try {
        let sql = 'SELECT * FROM clientes_01';
        let params = [];

        // Filtro por RUT
        if (rut) {
            sql += ' WHERE rut = $1';
            params = [rut];
        } 
        // Filtro por Edad Exacta
        else if (edad) {
            sql += ' WHERE edad = $1';
            params = [edad];
        } 
        // Filtro por Rango de Edad
        else if (edadMin && edadMax) {
            sql += ' WHERE edad BETWEEN $1 AND $2';
            params = [edadMin, edadMax];
        } 
        // Filtro por Nombre (ILIKE para que no importe mayúsculas/minúsculas)
        else if (nombre) {
            sql += ' WHERE nombre ILIKE $1';
            params = [`${nombre}%`]; 
        }

        const { rows } = await pool.query(sql, params);

        if (rows.length === 0) {
            return res.status(200).json({ message: "No se encontraron coincidencias" });
        }
        
        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({ error: "Error en la consulta" });
    }
});

// 2. POST
app.post('/clientes', async (req, res) => {
    const { rut, nombre, edad } = req.body;

    if (isNaN(edad) || edad === "") {
        return res.status(400).json({ error: "La edad debe ser un número válido." });
    }

    try {
        const text = 'INSERT INTO clientes_01(rut, nombre, edad) VALUES($1, $2, $3) RETURNING *';
        const values = [rut, nombre, edad];
        const result = await pool.query(text, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { 
            res.status(409).json({ error: "Conflicto: El RUT ya está registrado." });
        } else {
            res.status(500).json({ error: "Error al crear el cliente." });
        }
    }
});

// 3. PUT
app.put('/clientes/:rut', async (req, res) => {
    const { rut } = req.params;
    const { nombre } = req.body;

    try {
        const text = 'UPDATE clientes_01 SET nombre = $1 WHERE rut = $2 RETURNING *';
        const values = [nombre, rut];
        const result = await pool.query(text, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Cliente no encontrado." });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el cliente." });
    }
});

// 4. DELETE
app.delete('/clientes_filtros', async (req, res) => {
    const { edad, edadMin, edadMax } = req.query;
    let sql = '';
    let params = [];

    if (edad) {
        sql = 'DELETE FROM clientes_01 WHERE edad = $1 RETURNING nombre';
        params = [edad];
    } else if (edadMin && edadMax) {
        sql = 'DELETE FROM clientes_01 WHERE edad BETWEEN $1 AND $2 RETURNING nombre';
        params = [edadMin, edadMax];
    }

    try {
        const { rows } = await pool.query(sql, params);
        if (rows.length === 0) {
            return res.status(404).json({ message: "No hay coincidencias para eliminar" });
        }
        const nombres = rows.map(r => r.nombre).join(', ');
        res.status(200).json({ message: `Eliminados: ${nombres}` });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 CRUD de Clientes activo en http://localhost:${PORT}`);
});