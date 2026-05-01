import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedYear = null;

renderProjects(getFilteredProjects(), projectsContainer, 'h2');
renderPieChart(getSearchFilteredProjects());

function getSearchFilteredProjects() {
  return projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

function getFilteredProjects() {
    let filteredProjects = projects.filter((project) => {
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
    });
  
    if (selectedYear !== null) {
      filteredProjects = filteredProjects.filter((project) => {
        return String(project.year) === String(selectedYear);
      });
    }
  
    return filteredProjects;
  }

function renderPieChart(projectsGiven) {
  let svg = d3.select('#projects-plot');
  let legend = d3.select('.legend');

  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => {
    return {
      value: count,
      label: String(year),
    };
  });

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  arcs.forEach((arc, idx) => {
    let year = data[idx].label;

    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .attr('class', selectedYear === year ? 'selected' : '')
      .on('click', () => {
        selectedYear = selectedYear === year ? null : year;

        renderProjects(getFilteredProjects(), projectsContainer, 'h2');
        renderPieChart(getSearchFilteredProjects());
      });
  });

  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color: ${colors(idx)}`)
      .attr(
        'class',
        selectedYear === d.label ? 'legend-item selected' : 'legend-item'
      )
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedYear = selectedYear === year ? null : year;

        renderProjects(getFilteredProjects(), projectsContainer, 'h2');
        renderPieChart(getSearchFilteredProjects());
      });
  });
}

searchInput.addEventListener('input', (event) => {
    query = event.target.value;
  
    renderProjects(getFilteredProjects(), projectsContainer, 'h2');
    renderPieChart(getSearchFilteredProjects());
  });


