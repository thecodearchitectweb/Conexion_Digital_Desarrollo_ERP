import bcrypt from 'bcryptjs'
import { createUser } from '../../repositories/users/insertar_nuevo_usuario.js'  // tu repo
import express from 'express'
const app = express()



// Muestra el formulario para crear un usuario
export const newUser = async (req, res) => {
  try {
    return res.render('users/new_user')
  } catch (error) {
    console.error("Error mostrando formulario:", error)
    return res.status(500).send("Error al cargar la vista")
  }
}


// Procesa la creación de un nuevo usuario
export const _newUser = async (req, res) => {
  try {
    const {
      nombre,
      documento,
      estado,
      fecha_nacimiento,
      correo,
      contacto,
      direccion,
      area,
      cargo,
      lider_directo,
      rol,
      usuario,
      contraseña
    } = req.body


    // 1) Validación mínima
    if (!usuario || !contraseña) {
      return res.status(400).json({ message: 'El usuario y la contraseña son obligatorios' })
    }


    // 2) Hashear la contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(contraseña, salt)


    // 3) Construir el objeto para insertar
    const newUserData = {
      nombre: nombre || null,
      documento: documento || null,
      estado: estado || null,
      fecha_nacimiento: fecha_nacimiento || null,
      correo: correo || null,
      contacto: contacto || null,
      direccion: direccion || null,
      area: area || null,
      cargo: cargo || null,
      lider_directo: lider_directo || null,
      rol: rol || null,
      usuario,
      password: hashedPassword,
      login_attempts: 0,
      lock_until: null
    }


    // 4) Llamar al repositorio
    const userId = await createUser(newUserData)


    // 5) Responder al cliente
    return res.status(201).json({
      message: 'Usuario creado exitosamente',
      id: userId,
      usuario
    })


  } catch (error) {
    console.error("Error al crear usuario:", error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}
