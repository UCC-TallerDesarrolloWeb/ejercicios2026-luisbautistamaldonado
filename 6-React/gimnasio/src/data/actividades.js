// Imágenes de src/assets: se importan (Vite las optimiza en el build)
import taekwondo from '@assets/home/taekwondo.jpg'
import zumba from '@assets/home/zumba.jpg'

export const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export const activities = [
  {
    nombre: 'taekwondo',
    descripcion: 'Arte marcial coreana',
    horarios: [
      { dia: 2, 'hora-inicio': '18:30', 'hora-fin': '20:00' },
      { dia: 4, 'hora-inicio': '18:30', 'hora-fin': '20:00' },
    ],
  },
  {
    nombre: 'zumba',
    descripcion: 'ritmos latinos',
    horarios: [
      { dia: 1, 'hora-inicio': '19:30', 'hora-fin': '20:30' },
      { dia: 3, 'hora-inicio': '19:30', 'hora-fin': '20:30' },
    ],
  },
]

// Cards de la Home: 2 imágenes de assets (importadas) y 2 de public (ruta directa)
export const actividadesHome = [
  { titulo: 'Taekwondo', imagen: taekwondo },
  { titulo: 'Yoga', imagen: '/home/yoga.webp' },
  { titulo: 'Zumba', imagen: zumba },
  { titulo: 'Funcional', imagen: '/home/funcional.jpg' },
]
