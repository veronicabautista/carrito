//Variables

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];


cargarEventListeners();
function cargarEventListeners() {
  listaCursos.addEventListener('click', agregarCurso);

  //Elimina cursos del carrito
  carrito.addEventListener('click', eliminarCurso);

  //Muestra los cursos del LocalStorage
  document.addEventListener('DOMContentLoaded', () =>{
    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carritoHTML();
  })



  //Vaciar carrito
  vaciarCarritoBtn.addEventListener('click', () => {
    articulosCarrito  = [];
    
    limpiarHTML();
  
  });

}

//Funciones 
function agregarCurso(e){
  e.preventDefault();

  if(e.target.classList.contains('agregar-carrito')) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

function eliminarCurso(e){
  console.log(e.target.classList);
  if(e.target.classList.contains('borrar-curso')) { 
    const cursoId = e.target.getAttribute('data-id');

    //Elimina del array del carrito por el ID
    articulosCarrito =  articulosCarrito.filter(curso => curso.id !== cursoId);

    carritoHTML();

}}

//Extraer datos del HTML del curso
function leerDatosCurso(curso){

  // console.log(curso)

  //Crear objeto con el contenido del curso seleccionado
  const infoCurso = {
    imagen: curso.querySelector('img').src,
    titulo: curso.querySelector('h4').textContent,
    precio: curso.querySelector('.precio span').textContent,
    id: curso.querySelector('a').getAttribute('data-id'),
    cantidad: 1,
  }

  //Revisa si un elemento ya existe
  const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
  if(existe){
    //Actualizamos cantidad
    const cursos = articulosCarrito.map( curso => {
      if (curso.id === infoCurso.id){
        curso.cantidad++;
        return curso; // devuelve el objeto actualizado
      }else {
        return curso; // devuelve los objetos que no están duplicados
      }
    });
    articulosCarrito = [...cursos];
  }else{
    //Agregamos elementos al carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  console.log(articulosCarrito)
  carritoHTML();
  };


function carritoHTML(){

  //Limpiar el HTML
  limpiarHTML()

  //Recorre el carrito y genera el HTML
  articulosCarrito.forEach( curso => {
    const { imagen, titulo, precio, cantidad, id} = curso;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <img src="${imagen}" width="100">
      </td>
      <td>${titulo}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td>
        <a href="#" class="borrar-curso" data-id="${id}"> X </a>
      </td>
    `;

    //Agrega el HTML del carrito al tbody
    contenedorCarrito.appendChild(row);
  });

  //Agregar el carrito al Storage
  sincronizarStorage();
}

function sincronizarStorage(){
  localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}


function limpiarHTML(){
  while (contenedorCarrito.firstChild){
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}