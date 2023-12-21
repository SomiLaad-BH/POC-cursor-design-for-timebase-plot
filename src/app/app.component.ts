import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private svgElement: any;
  private plotWidth: number = 800;
  private plotHeight: number = 600;
  private xScale: any;
  private yScale: any;
  private margin: number = 40;
  private data: any[] = [];
  private gapArray: boolean[] = [
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    true,
    false,
  ];

  constructor(private elementRef: ElementRef) {
    this.initializeData();
  }

  ngOnInit(): void {
    this.createPlot();
    this.drawPlot();
    this.addCursor();
  }

  private initializeData() {
    for (let i = 0; i < 360; i++) {
      const yValue = Math.sin(i * (Math.PI / 180) * 2);
      const color = this.gapArray[i] ? 'transparent' : 'blue';
      this.data.push({ x: i, y: yValue, color });
    }
  }

  private createPlot() {
    let divSelection = d3.select(this.elementRef.nativeElement).select('#sine-wave-chart');
    this.svgElement = divSelection
      .append('svg')
      .classed('svg', true)
      .classed('svg-background', true)
      .attr('width', this.plotWidth + 'px')
      .attr('height', this.plotHeight + 'px')
      .attr('tabindex', 0)
      .style('outline', 'none');

    this.svgElement
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')')
      .attr('id', 'plot-area');
  }

  private drawPlot() {
    this.xScale = d3.scaleLinear().range([0, this.plotWidth - 2 * this.margin]);
    this.xScale.domain([0, 360]);

    const xAxis = d3.axisBottom(this.xScale);

    this.svgElement
      .select('#plot-area')
      .append('g')
      .attr('class', 'axis')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + (this.plotHeight - 2 * this.margin) + ')')
      .call(xAxis);

    this.yScale = d3.scaleLinear().range([this.plotHeight - 2 * this.margin, 0]);
    this.yScale.domain([-1, 1]);

    const yAxis = d3.axisLeft(this.yScale);

    this.svgElement
      .select('#plot-area')
      .append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    const line = d3.line()
      .x((d: any) => this.xScale(d.x))
      .y((d: any) => this.yScale(d.y));

      let isPreviousTransparent = false;

      for (let i = 0; i < this.data.length - 1; i++) {
        if (this.data[i].color === 'transparent' || this.data[i + 1].color === 'transparent') {
          // If the color is transparent, mark it and continue
          isPreviousTransparent = true;
          continue;
        }
  
        if (isPreviousTransparent) {
          // Add a red dot after the last transparent segment
          this.svgElement
            .select('#plot-area')
            .append('circle')
            .attr('class', 'red-dot')
            .attr('cx', this.xScale(this.data[i].x))
            .attr('cy', this.yScale(this.data[i].y))
            .attr('r', 5)
            .attr('fill', 'red');
          
          isPreviousTransparent = false; 
        }
  
        this.svgElement
          .select('#plot-area')
          .append('path')
          .datum([this.data[i], this.data[i + 1]])
          .attr('class', 'line')
          .style('fill', 'none')
          .attr('stroke-width', 1.5)
          .attr('stroke', this.data[i].color)
          .attr('d', line);
      }
    }

  private addCursor() {
    const plotArea = this.svgElement.select('#plot-area');
    const cursor = plotArea
      .append('circle')
      .attr('class', 'cursor')
      .attr('r', 5) 
      .attr('fill', 'green');

    cursor.style('display', 'block');

    plotArea.on('mousemove', () => {
      const [mouseX] = d3.pointer(event);
      const xValue = this.xScale.invert(mouseX);
      const yValue = Math.sin(xValue * (Math.PI / 180) * 2);
      cursor.attr('cx', mouseX).attr('cy', this.yScale(yValue));
    });
  }
}
