# 2d NavMesh Experiment

Trying out a couple of different approaches for building up
2D navmeshes from 2D grids. The objective is not necessarily
to get the "best" solution, but one that works in reasonable
time and with reasonable accuracy.

Open in CodeBox or Vercel (https://csb-vz5jc-2ch0kpug0.vercel.app/)
to try random maps or draw your own and see it update live.

NavMesh building on a 40x40 grid takes ~0.2ms. Pathfinding takes
1-5ms depending on the obstacle density.

This example is a 40x40 grid with obstacle density (set in `constants.ts`)
of 0.5

![Mesh navigation example](public/mesh_navigation_example.png)

Created with CodeSandbox
