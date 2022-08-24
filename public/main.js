const socket = io();
const btnCerrarSession = document.getElementById("btnCerrarSession");

const autorSchema = new normalizr.schema.Entity("autor", {}, { idAttribute: "email" });
const mensajeSchema = new normalizr.schema.Entity("mensaje", {
    autor: autorSchema,
    });

const createProducto = () => {
  event.preventDefault();
  try {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;

    const product = { title, price, thumbnail };
    socket.emit("nuevoProducto", product);
  } catch (e) {
    console.log(e);
  }
};

socket.on("leerProducto", (allProducto) => {
  event.preventDefault();
  if (allProducto instanceof Array) {
    document.getElementById("tbodyProductos").innerHTML = "";
    document.getElementById("divErrors").innerHTML = "";
    for (let i = 0; i < allProducto.length; i++) {
      let producto = allProducto[i];
      let productoHTML = `
            <tr>
               <td>${producto.title}</td>
               <td>${producto.price}</td>
               <td><img style="width: 50px; height:50px" src=${producto.thumbnail} alt=""></td>
            </tr>
            `;
      document.getElementById("tbodyProductos").innerHTML += productoHTML;
    }
  } else {
    document.getElementById("divErrors").innerHTML =
      "<h1>No hay Productos</h1>";
  }
});

const createMessage = () => {
  event.preventDefault();
  try {
    const mensaje = document.getElementById("mensaje").value;

    const autor = {
      email: document.getElementById("email").value,
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      edad: document.getElementById("edad").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value,
    };
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();

    const message = { mensaje, autor, date: date + " " + time };
    console.log(message, "MESSAGE");
    socket.emit("nuevoMensaje", message);
  } catch (e) {
    console.log(e);
  }
};

socket.on("leerMensaje", (allMessage) => {
  const mensajeDesnormalizado = normalizr.denormalize(
    allMessage.result,
    [mensajeSchema],
    allMessage.entities
  );

  if (mensajeDesnormalizado instanceof Array) {
    document.getElementById("messagesDiv").innerHTML = "";
    document.getElementById("porcentajeDiv").innerHTML = "";

    for (let i = 0; i < mensajeDesnormalizado.length; i++) {
      let mensaje = mensajeDesnormalizado[i]._doc;
      console.log(mensaje)
      let mensajeHTML = `
            <p> 
            <spam style="color:blue">${mensaje.autor.email}</spam>
            <spam style="color:red">${mensaje.createdAt}</spam> :
            <spam style="color:green">${mensaje.mensaje}</spam>
            </p>`;
      document.getElementById("messagesDiv").innerHTML += mensajeHTML;
    }

    let porcentaje = `Compresion de mensajes: <p>${(((JSON.stringify(allMessage).length) * 100) / JSON.stringify(mensajeDesnormalizado).length).toFixed(2)} %</p>`;
    document.getElementById("porcentajeDiv").innerHTML = porcentaje;
  } else {
    document.getElementById("messagesDiv").innerHTML =
      "<h1>No hay Mensajes</h1>";
  }

  // if(allMessage instanceof Array){
  //     document.getElementById("messagesForm").innerHTML = "";
  //     for (let i = 0; i < allMessage.length; i++) {
  //         let mensaje = allMessage[i];
  //         let mensajeHTML = `
  //         <p>
  //         <spam style="color:blue">${mensaje.mail}</spam>
  //         <spam style="color:red">${mensaje.date}</spam> :
  //         <spam style="color:green">${mensaje.mensaje}</spam>
  //         </p>`
  //         document.getElementById("messagesForm").innerHTML += mensajeHTML;
  //     }
  // }else{
  //     document.getElementById("messagesForm").innerHTML = "<h1>No hay Mensajes</h1>";
  // }
});
