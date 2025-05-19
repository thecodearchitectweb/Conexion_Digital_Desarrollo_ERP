
import bcrypt from 'bcryptjs'
import express from 'express'
const app = express()


export const newUser = async (req, res) => {
    try {

        return res.render('users/new_user')

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error al cargar la vista");
    }
}



/* CREACION DE UN NUEVO USUARIO */
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
            usuario,
            contraseña
        } = req.body


        // Generar salt y hashear la contraseña
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(contraseña, salt)

        console.log("CONTRASEÑA HASHED: ", hashedPassword)

        const isMatch = await bcrypt.compare(contraseña, hashedPassword)
        
        console.log("¿Coincide la contraseña con el hash?", isMatch)



        // Crear nuevo usuario en la base de datos
/*         const newUserData = {
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
            usuario,
            password: hashedPassword
        } */

        //const newUser = await User.create(newUserData)

        // Responder al cliente
/*         return res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: newUser.usuario,
            id: newUser._id
        }) */

    } catch (error) {
        console.error("Error al crear usuario:", error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}
