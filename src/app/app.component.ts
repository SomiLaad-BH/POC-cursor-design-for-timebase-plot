import { Component } from '@angular/core';
import * as d3 from 'd3';
import { data } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'd3-cursors';
  svgElement: any;
  plotWidth: number = 800;
  plotHeight: number = 600;
  data = data;
  xScale: any;
  yScale: any;
  margin: number = 40;

  ngOnInit(): void {
    this.createPlot();
    this.drawPlot();
    this.renderCursor(6.5);
  }

  createPlot() {
    let divSelection = d3.select('#chart');
    this.svgElement = divSelection
      .append('svg')
      .classed('svg', true)
      .classed('svg-background', true)
      .attr('width', this.plotWidth + 'px')
      .attr('height', this.plotHeight + 'px')
      .attr('tabindex', 0)
      .style('outline', 'none')
      .on('click', (event: any) => this.mouseClick(event))
      .append('g')
      .attr('transform', 'translate(0,0)');

    this.svgElement
      .append('defs')
      .append('svg:clipPath')
      .attr('id', 'zoomClip')
      .append('svg:rect')
      .attr('width', this.plotWidth - this.margin)
      .attr('height', this.plotHeight - this.margin)
      .attr('x', this.margin)
      .attr('y', this.margin)
      .attr('cursor', 'pointer');
    this.svgElement
      .append('g')
      .attr('clip-path', 'url(#zoomClip)')
      .attr('id', 'clipPath');
  }

  drawPlot() {
    this.xScale = d3.scaleLinear().range([0, this.plotWidth - this.margin]);
    this.xScale.domain([
      d3.min(this.data, (d) => d.x),
      d3.max(this.data, (d) => d.x),
    ]);

    const xAxis = d3.axisBottom(this.xScale);
    // .tickSize(-this.plotHeight)
    // .tickSizeOuter(0)
    // .tickFormat((d) => d.toString());

    const xAxisSvg = this.svgElement
      .append('g')
      .attr('class', 'axis')
      .attr('id', 'x-axis')
      .attr(
        'transform',
        'translate(' +
          this.margin +
          ',' +
          (this.plotHeight - 2 * this.margin) +
          ')'
      )
      .call(xAxis);

    this.yScale = d3
      .scaleLinear()
      .range([this.margin, this.plotHeight - 2 * this.margin]);
    this.yScale.domain([
      d3.max(this.data, (d) => d.y),
      d3.min(this.data, (d) => d.y),
    ]);

    const yAxis = d3.axisLeft(this.yScale);
    // .tickSize(-this.plotWidth)
    // .tickSizeOuter(0)
    // .tickFormat((d) => d.toString());

    this.svgElement
      .append('g')
      .attr('id', 'y-axis')
      .style('transform', 'translate(' + this.margin + 'px,  0)')
      .call(yAxis);

    const cursorAxis = d3.axisLeft(this.yScale).tickFormat(() => '');

    this.svgElement
      .append('g')
      .attr('id', 'cursor-axis')
      .attr('pointer-events', 'all')
      .attr('cursor', 'pointer')
      .style('transform', 'translate(' + this.margin + 'px,  0)')
      .style('color', 'green')
      .call(cursorAxis);

    this.svgElement
      .selectAll('#cursor-axis .tick')
      .selectAll('line')
      .attr('x2', (d: any) => {
        return 12;
      })
      .style('transform', 'translate(-6px,  0)');

    const innerSVG = this.svgElement
      .append('g')
      .style(
        'transform',
        'translate(' + this.margin + 'px, ' + this.margin + 'px)'
      );

    innerSVG
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('id', 'line')
      .style('fill', 'transparent')
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('stroke', (d: any) => 'red')
      .attr(
        'd',
        d3
          .line()
          .defined((d: any) => {
            if (d.y !== null && !isNaN(d.y)) {
              return true;
            } else {
              return false;
            }
          })
          .x((d: any) => this.xScale(d.x))
          .y((d: any) => this.yScale(d.y))
      );
  }
  mouseClick(event: any): void {
    console.log('...click');
    console.log(event);
    this.moveCursor(event.x);
  }
  moveCursor(x: any) {
    const newCursorPosition = this.margin + x;
    this.svgElement
      .select('#cursor-axis')
      .style('transform', 'translate(' + newCursorPosition + 'px,  0)');
  }

  private renderCursor(cursorPosition: number) {
    const newCursorPosition = this.margin + this.xScale(cursorPosition);
    this.svgElement
      .select('#cursor-axis')
      .style('transform', 'translate(' + newCursorPosition + 'px,  0)');

    this.addDrag();
  }

  addDrag() {
    this.svgElement.select('#cursor-axis').call(d3.drag().on('drag', null));
    let drag = d3.drag().on('drag', (d: any) => {
      this.moveCursor(d.x);
    });

    this.svgElement.select('#cursor-axis').call(drag);
  }

  // private renderCursor(cursorPosition: number) {
  //   console.log('>..');
  //   let svgWithClip = this.svgElement.select('#zoom');
  //   return this.svgElement
  //     ?.append('g')
  //     .append('line')
  //     .attr('x1', this.xScale(cursorPosition))
  //     .attr('y1', 0)
  //     .attr('x2', this.xScale(cursorPosition))
  //     .attr('y2', this.plotHeight - 2 * this.margin)
  //     .style('stroke-width', 2)
  //     .style('stroke', 'green')
  //     .style('fill', 'green');
  // }
}
