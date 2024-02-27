import { Component, computed, signal, effect, OnInit, inject, Injector } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tarea } from './modelos/tarea';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  listaTareas= signal<Tarea[]>([
    {
      id: Date.now(),
      titulo: 'Devolver libros biblioteca',
      completada: false
    },
    {
      id: Date.now() + 1,
      titulo: 'Comprar tinta impresora',
      completada:true
    }
  ])

  filtro=signal('todas');
  injector = inject(Injector);

  ngOnInit(){
    var storage = localStorage.getItem('listaTareas') ;
    if (storage){
      this.listaTareas.set(JSON.parse(storage)  );
    };
    this.guardarCambios();
  }

  tareasFiltradas = computed(() => {
    const filtro = this.filtro();
    const tareas = this.listaTareas();

    if (filtro === 'pendientes'){
      return tareas.filter(tarea => tarea.completada === false)
    }
    return tareas;
  })

  filtrar(tipo:string){
    this.filtro.set(tipo);
  }

  guardarCambios(){
    effect(() => {
      console.log('guardando cambios');
      const tareas = this.listaTareas();
      localStorage.setItem('listaTareas', JSON.stringify(tareas))
    }, {injector: this.injector}) // esta línea es necesaria para aplicar el effect() fuera del constructor
  }

  anadir(event: Event){ //manejador evento para añadir tarea
    const tarea = event.target as HTMLInputElement;
    if (tarea.value.trim()){
      this.anadirTarea(tarea.value);
    }
    tarea.value = '';
  }

  anadirTarea(tarea:string){ //añade la tarea realmente al array
    const nuevaTarea = {
      id: Date.now(),
      titulo: tarea,
      completada: false
    }
    //this.listaTareas().push(nuevaTarea);
    this.listaTareas.update((tareas) =>
      [...tareas, nuevaTarea]
    )
  }

  modificar(id:number){ //manejador de evento para modificar si la tarea está completada o no
    this.actualizarTarea(id);
  }

  actualizarTarea(id:number){ //modifica la tarea realmente en el array
    this.listaTareas.update((tareas)=>{
      return tareas.map((tarea)=>{
        if (tarea.id === id){
          return {
            ...tarea,
            completada: !tarea.completada
          }
        }
        return tarea;
      })
    })
  }

  borrar(id:number){ //manejador de evento para borrar tarea
    this.borrarTarea(id);
  }
  borrarTarea(id:number){ //elimina la tarea realmente en el array
    this.listaTareas.update((tareas) => tareas.filter((tarea) => tarea.id !== id))
  }

}
