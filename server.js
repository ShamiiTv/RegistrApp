const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());


const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'registrapp'
});

app.post('/register', async (req, res) => {
  const { email, password, tipoUsuario, codigoProfesor, confirmPassword } = req.body;

  console.log('Datos recibidos:', req.body); 


  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  if (tipoUsuario === 'profesor') {
    try {
      const [results] = await db.query('SELECT * FROM codigos_profesor WHERE codigo = ?', [codigoProfesor]);

      if (results.length === 0) {
        return res.status(400).json({ message: 'Código especial inválido para profesores.' });
      }

      await db.query('INSERT INTO usuarios (email, password, tipoUsuario, codigoProfesor) VALUES (?, ?, ?, ?)', [email, hashedPassword, tipoUsuario, codigoProfesor]);
      return res.status(201).json({ message: 'Usuario registrado exitosamente.' });

    } catch (err) {
      console.error('Error processing registration:', err);
      return res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
  } else {
    try {
      await db.query('INSERT INTO usuarios (email, password, tipoUsuario, codigoProfesor) VALUES (?, ?, ?, ?)', [email, hashedPassword, tipoUsuario, null]);
      return res.status(201).json({ message: 'Usuario registrado exitosamente.' });

    } catch (err) {
      console.error('Error inserting user into database:', err);
      return res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (results.length > 0) {
      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return res.status(200).json({
          success: true,
          tipoUsuario: user.tipoUsuario,
          isOscuro: user.isOscuro 
        });
      } else {
        return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
      }
    } else {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
    }
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    return res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
});


app.post('/update-preferences', async (req, res) => {
  const { email, isOscuro } = req.body;

  try {
    await db.query('UPDATE usuarios SET isOscuro = ? WHERE email = ?', [isOscuro, email]);
    res.status(200).json({ message: 'Preferencias actualizadas correctamente.' });
  } catch (err) {
    console.error('Error al actualizar preferencias:', err);
    res.status(500).json({ message: 'Error al actualizar preferencias.' });
  }
});

app.post('/register-attendance', (req, res) => {
  const { userId, date, status } = req.body; 

  const query = 'INSERT INTO asistencia (userId, date, status) VALUES (?, ?, ?)';
  db.query(query, [userId, date, status], (err, result) => {
    if (err) {
      return res.status(500).send('Error al registrar la asistencia');
    }
    res.status(200).send('Asistencia registrada correctamente');
  });
});

app.get('/get-attendance/:userId', (req, res) => {
  const { userId } = req.params;

  const query = 'SELECT * FROM asistencia WHERE userId = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).send('Error al obtener los datos de asistencia');
    }
    res.status(200).json(result);
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
