/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import Page from '../../components/Page';

// module aliases

export default function Demomatter() {
  const [vel, setVel] = useState({ x: 0, y: 0 });
  var scene = useRef();
  var isPressed = useRef(false);
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Vertices = Matter.Vertices,
    Constraint = Matter.Constraint,
    World = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies;
  var engine = useRef(Engine.create());

  var body = Bodies.circle(250, 300, 25);
  var constraint = Constraint.create({
    pointA: { x: 200, y: 400 },
    bodyB: body,
    pointB: { x: 0, y: 25 },
    stiffness: 0.005,
    showVelocity: true,
  });

  useEffect(() => {
    World.add(engine.current.world, [body, constraint]);

    var body1 = Bodies.rectangle(200, 200, 50, 50);

    World.add(engine.current.world, body1);

    var render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: 'black',
      },
    });

    World.add(engine.current.world, [
      Bodies.rectangle(300, 0, 1000, 50, { isStatic: true }),
      Bodies.rectangle(300, 600, 1000, 50, { isStatic: true }),
      Bodies.rectangle(800, 200, 50, 1000, { isStatic: true }),
      Bodies.rectangle(0, 250, 50, 650, { isStatic: true }),
    ]);

    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    Composite.add(engine.current.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });
    Events.on(engine.current, 'afterUpdate', () => setVel({ ...body.velocity }));

    Matter.Runner.run(engine.current);
    Render.run(render);
  }, [setVel]);

  // useEffect(() => {
  //   Events.on(engine.current, 'afterUpdate', () => setVel(body.velocity));
  //   console.log(body.velocity);
  // });

  return (
    <Page>
      <div ref={scene} style={{ width: '100%', height: '100%' }} />
      x:{vel.x.toFixed(2).toString()}
      y:{vel.y.toFixed(2).toString()}
    </Page>
  );
}
