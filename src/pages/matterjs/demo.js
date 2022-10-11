/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-streaming';
import Page from '../../components/Page';

// module aliases
const Chart = require('react-chartjs-2').Chart;

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
};

const color = Chart.helpers.color;
const data1 = {
  datasets: [
    {
      label: 'Dataset 1 (linear interpolation)',
      backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
      borderColor: chartColors.red,
      fill: false,
      lineTension: 0,
      borderDash: [8, 4],
      data: [],
    },
  ],
};

export default function Demomatter() {
  const [vel, setVel] = useState({ x: 0, y: 0 });
  const [fix, setFix] = useState({});

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

    const interval = setInterval(() => {
      setVel({ ...body.velocity });
    }, 0);

    Events.on(engine.current, 'afterUpdate', () => interval);

    Matter.Runner.run(engine.current);
    Render.run(render);
  }, []);

  useEffect(() => {
    setFix({
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        xAxes: [
          {
            type: 'realtime',
            distribution: 'linear',
            realtime: {
              onRefresh: function (chart) {
                chart.data.datasets[0].data.push({
                  x: moment(),
                  y: vel.x,
                });
              },
              time: {
                displayFormat: 'h:mm',
              },
            },
            ticks: {
              displayFormats: 1,
              maxRotation: 0,
              minRotation: 0,
              stepSize: 1,
              maxTicksLimit: 30,
              minUnit: 'second',
              source: 'auto',
              autoSkip: true,
              callback: function (value) {
                return moment(value, 'HH:mm:ss').format('mm:ss');
              },
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              max: 20,
              min: -20,
            },
          },
        ],
      },
    });
  }, [vel]);

  return (
    <Page>
      <div ref={scene} style={{ width: '100%', height: '100%' }} />
      x:{vel.x.toFixed(2).toString()}
      y:{vel.y.toFixed(2).toString()}
      <Line data={data1} options={fix} />
    </Page>
  );
}
