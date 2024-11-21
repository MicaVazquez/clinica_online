import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('300ms ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
    query('@*', animateChild(), { optional: true }),
  ]),
]);
// export const slideInAnimation = trigger('routeAnimations', [
//   transition('* <=> *', [
//     style({ position: 'relative' }), // El contenedor de las rutas sigue siendo relativo

//     // Establecemos el estilo de los elementos de entrada y salida
//     query(
//       ':enter, :leave',
//       [
//         style({
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//         }),
//       ],
//       { optional: true }
//     ),

//     // Configuramos la entrada de la nueva ruta: de arriba hacia abajo
//     query(
//       ':enter',
//       [
//         style({ top: '-100%' }), // Empuja la entrada hacia arriba fuera de la pantalla
//       ],
//       { optional: true }
//     ),

//     // Configuramos la salida de la ruta anterior: de arriba hacia abajo
//     query(':leave', animateChild(), { optional: true }),

//     group([
//       // Animación de la salida: deslizamiento hacia arriba
//       query(
//         ':leave',
//         [
//           animate('300ms ease-out', style({ top: '100%' })), // La salida va hacia abajo
//         ],
//         { optional: true }
//       ),

//       // Animación de la entrada: deslizamiento hacia abajo
//       query(
//         ':enter',
//         [
//           animate('300ms ease-out', style({ top: '0%' })), // La entrada llega desde arriba
//         ],
//         { optional: true }
//       ),
//     ]),

//     query('@*', animateChild(), { optional: true }), // Aplica animaciones secundarias
//   ]),
// ]);
