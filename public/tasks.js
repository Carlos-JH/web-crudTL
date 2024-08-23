//nuestra data
const tareas = [
    { id: 1, titulo: "Recibir mercancía", descripcion: "Recepción y verificación de la mercancía entrante", estado: "Pendiente" },
    { id: 2, titulo: "Almacenar mercancía", descripcion: "Organización de la mercancía en el almacén", estado: "En progreso" },
    { id: 3, titulo: "Surtir pedidos", descripcion: "Preparación de pedidos para envío", estado: "Pendiente" },
    { id: 4, titulo: "Embarcar mercancía", descripcion: "Carga y despacho de mercancía a transportistas", estado: "Completado" },
    { id: 5, titulo: "Inventario", descripcion: "Recuento de existencias en el almacén", estado: "Pendiente" },
    { id: 6, titulo: "Limpieza del almacén", descripcion: "Mantenimiento y limpieza de áreas de trabajo", estado: "En progreso" },
    { id: 7, titulo: "Recibir devoluciones", descripcion: "Recepción y procesamiento de productos devueltos", estado: "Pendiente" },
    { id: 8, titulo: "Revisar daños", descripcion: "Inspección de mercancía por daños", estado: "Completado" },
    { id: 9, titulo: "Actualizar sistema", descripcion: "Registro de movimientos en el sistema de inventario", estado: "En progreso" },
    { id: 10, titulo: "Capacitar personal", descripcion: "Entrenamiento de personal en nuevos procesos", estado: "Pendiente" }
];


    

function llenarTablaTareas(tareas) {
    let res = "";

    // recorremos el array de tareas
    tareas.forEach((tarea) => {
        res += "<tr>";
        res += "<td>" + tarea.id + "</td>";
        res += "<td>" + tarea.titulo + "</td>";
        res += "<td>" + tarea.descripcion + "</td>";
        res += "<td>" + tarea.estado + "</td>";
        res += "<td><button type='button' class='btn btn-outline-secondary' onclick='abrirModalEditarEstado(" + tarea.id + ")'>Editar</button></td>";
        res += "<td><button type='button' class='btn btn-outline-danger' onclick='eliminarTarea(" + tarea.id + ")'>Eliminar</button></td>";
        res += "</tr>";
    });

    $("#tabla_tareas").html(res);

    // iniciamos la tabla con las propiedades de DataTables
    $(document).ready(function() {

        // if ($.fn.DataTable.isDataTable('#tabla_tareas_dt')) {
        //     $('#tabla_tareas_dt').DataTable().destroy();
        // }  //validamos que que se deseche la tabla y no sobreescriba 
        $('#tabla_tareas_dt').DataTable({
            order: [[0, "asc"]],
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                "infoEmpty": "Mostrando 0 a 0 de 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
        });
    });
}

// La4lamamos a la función con el arreglo de tareas
llenarTablaTareas(tareas);



//__________________GUARDAR

const guardar_tarea =() => {
    // Obtener valores de los campos del formulario
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const estado = document.getElementById('estado').value;

    // validamos que los campos obligatorios no estén vacíos---coniderar estado
    if (titulo === "" || descripcion === "") {
        Swal.fire({
            icon: 'error',
            title: 'Campos requeridos',
            text: 'Todos los campos son obligatorios',
            confirmButtonColor: '#004B87'
        });
        return;
    }

    // creamos un nuevo objeto tarea
    const nuevaTarea = {
        id: tareas.length + 1, // se asigna un nuevo ID basado en la longitud del array (de la data que se tiene)
        titulo: titulo,
        descripcion: descripcion,
        estado: estado
    };
    // enviamos la nueva tarea al servidor usando fetch API
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaTarea)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos del servidor:', data); 
    // añadimos la nueva tarea al array de tareas- mediante el metodo push "agregamos al final"
    tareas.push(nuevaTarea);

    // volvemos a llenar la tabla con las tareas actualizadas- type-refresh
    llenarTablaTareas(tareas);

    // Cerrar el modal
    cerrar_modal_tarea();
}).catch(error => {
    console.error('Error al agregar tarea:', error);
    Swal.fire({
        icon: 'error',
        title: 'Error al agregar tarea',
        text: 'Hubo un problema al agregar la tarea. Inténtalo de nuevo.',
        confirmButtonColor: '#004B87'
    });
});
};

const cerrar_modal_tarea = () => {
    // limpiamos los campos del formulario solo en caso que hayan registrados
    document.getElementById('titulo').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('estado').value = 'Pendiente';

    // Ocultar el modal
    $('#modal_formulario_nueva_tarea').modal('hide');
}

 

//___________________ELIMINAR
    

function eliminarTarea(id) {

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#004B87',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/tasks/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                console.log('Respuesta del servidor:', response);
                if (response.status === 204) {
                    const indice = tareas.findIndex(tarea => tarea.id === id);
                    if (indice !== -1) {
                        tareas.splice(indice, 1);
                        llenarTablaTareas(tareas);
                        Swal.fire({
                            icon: 'success',
                            title: `La tarea ${id} fue eliminada con éxito`,
                            confirmButtonColor: '#004B87'
                        });
                    }
                } else {
                    throw new Error('La respuesta de la red no fue correcta');
                }
            })
            .catch(error => {
                console.error('Error al eliminar la tarea:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar la tarea',
                    text: 'Hubo un problema al eliminar la tarea. Inténtalo de nuevo.',
                    confirmButtonColor: '#004B87'
                });
            });
        }
  
});
}

//_____________________EDITAR
function abrirModalEditarEstado(id, estadoActual) {
    // jalamos ID de la tarea que se va a editar
    document.getElementById('id_tarea_editar').value = id;
    // jalamos el estado actual de la tarea en el dropdown
    document.getElementById('nuevo_estado').value = estadoActual;

    console.log("tarea"+id);

    $('#modal_editar_estado').modal('show');
}


function guardarCambiosEstado() {
    // Obtenemos el ID de la tarea y el nuevo estado
    const id = document.getElementById('id_tarea_editar').value;
    const nuevoEstado = document.getElementById('nuevo_estado').value;


      // Enviar la solicitud PUT al servidor
      fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: nuevoEstado })
    }).then(data => {
        
    // buscamos/encontramos la tarea en el arreglo y actualizamos su estado
    const tarea = tareas.find(t => t.id === parseInt(id));
    if (tarea) {
        tarea.estado = nuevoEstado;
    // recargamooo la tabla con las tareas actualizadas
    llenarTablaTareas(tareas);
        Swal.fire({
            icon: 'success',
            title: `El estado de la tarea ${id} fue actualizado a ${nuevoEstado}`,
            confirmButtonColor: '#004B87'
        });

        // cerramos el modal
        $('#modal_editar_estado').modal('hide');
    } else {
        Swal.fire({
            icon: 'error',
            title: `No se encontró la tarea con ID ${id}`,
            confirmButtonColor: '#004B87'
        });
    }
    })
}


const  cerrarModalEditarEstado = () => {
    $('#modal_editar_estado').modal('hide');
}
