# ClinicaOnline 🏥  

ClinicaOnline es una plataforma desarrollada con **Angular** y **Firebase** para gestionar de manera virtual los turnos, pacientes y especialistas en una clínica médica.  
[Accede aquí](https://tp-clinica-c67ca.web.app)  

---

## Inicio  

Al ingresar a la URL, se mostrará una pantalla **Home**, desde la cual el usuario podrá:  
- **Iniciar Sesión** (Login).  
- **Registrarse como Especialista.**  
- **Registrarse como Paciente.**  



---

## Log In  

En esta ventana, el usuario podrá ingresar siempre y cuando:  
- Haya verificado su correo electrónico.  
- En el caso de los especialistas, haya sido aprobado previamente por el administrador.  

Además, se incluyen accesos rápidos a cada perfil desde la parte derecha de la pantalla.  



---

## Registro  

### **Registrarse Como Especialista**  
Un formulario de alta permitirá ingresar los datos esenciales para crear un perfil de especialista en la clínica.  



### **Registrarse Como Paciente**  
Formulario de alta donde se ingresan datos básicos, como:  
- Nombre, apellido, DNI, edad, email, contraseña.  
- Foto de perfil y credencial.  
- Selección de una obra social.  


---

## Funcionalidades por Rol  

### **Especialista**  

#### **Home**  
El Home permite navegar hacia las distintas secciones de la aplicación.  
 

#### **Mi Perfil**  
Los especialistas podrán:  
- Visualizar su información personal.  
- Administrar su jornada laboral, añadiendo horarios disponibles en los consultorios de la clínica.  



#### **Mis Turnos**  
Sección para gestionar los turnos asignados, con opciones como:  
- Aceptar o rechazar turnos.  
- Cancelar o finalizar turnos.  
- Dejar comentarios.  

 

---

### **Paciente**  


 

#### **Solicitar Turno**  
El paciente puede seleccionar:  
1. **Especialidad requerida.**  
2. **Especialista deseado.**  
3. Día (dentro de los próximos 15 días).  
4. Horarios disponibles.  

Los horarios mostrados estarán sujetos a disponibilidad.  

 

#### **Mis Turnos**  
El paciente puede:  
- Visualizar su historial de turnos y sus estados.  
- Cancelar turnos.  
- Calificar la atención recibida.  
- Ver reseñas de sus especialistas.  



---

### **Administrador**  

#### **Mi Perfil**  
El administrador podrá visualizar su información personal.  

#### **Administrar Especialistas**  
Sección para:  
- Habilitar o deshabilitar especialistas.  
- Dar de alta a nuevos especialistas.  



#### **Administrar Pacientes**  
Permite visualizar y administrar los datos de los pacientes, así como dar de alta a nuevos.  



#### **Administrar Administradores**  
Los administradores podrán crear nuevos administradores dentro de la clínica.  

  

#### **Dar Turnos**  
El administrador puede solicitar turnos para los pacientes. A diferencia de los pacientes, debe seleccionar a quién adjudicar el turno.  



#### **Visualizar Turnos**  
Sección para revisar todos los turnos de la clínica, con opciones de filtro por:  
- Especialista.  
- Especialidad.  
- Visualización completa sin restricciones.  

---


