import Matter from 'matter-js';
import React from 'react';
import Page from '../../components/Page';

// module aliases

export default function Demomatter() {
  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const Bodies = Matter.Bodies;
  const Composite = Matter.Composite;
  const Mouse = Matter.Mouse;
  const MouseConstraint = Matter.MouseConstraint;

  const engine = Engine.create();
  const world = engine.world;

  const render = Render.create({
    element: document.body,
    engine,
    options: {
      width: 800,
      height: 600,
      showVelocity: true,
    },
  });
  Render.run(render);
  const runner = Runner.create();

  Runner.run(runner, engine);
  Composite.add(world, [
    // falling blocks
    Bodies.rectangle(200, 100, 60, 60, { frictionAir: 0.001 }),
    Bodies.rectangle(400, 100, 60, 60, { frictionAir: 0.05 }),
    Bodies.rectangle(600, 100, 60, 60, { frictionAir: 0.1 }),

    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
  ]);
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });
  Composite.add(world, MouseConstraint);
  render.mouse = mouse;
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 },
  });
  return {
    engine,
    runner,
    render,
    function() {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
  };
}
