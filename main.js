import { streams } from './streams-data.js';

const streamsGrid = document.getElementById('streamsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const form = document.getElementById('addStreamForm');

let currentFilter = 'All';
let currentSearch = '';
let streamsState = [...streams]; // local copy so we can add new streams

function getFilteredStreams() {
  let data = [...streamsState];

  if (currentFilter !== 'All') {
    data = data.filter((stream) => stream.category === currentFilter);
  }

  if (currentSearch.trim() !== '') {
    const term = currentSearch.toLowerCase();
    data = data.filter(
      (stream) =>
        stream.title.toLowerCase().includes(term) ||
        stream.channel.toLowerCase().includes(term)
    );
  }

  return data;
}

function renderStreams() {
  const data = getFilteredStreams();

  if (data.length === 0) {
    streamsGrid.innerHTML =
      '<p style="color:#9ca3af;font-size:0.9rem;">No streams found.</p>';
    return;
  }

  const html = data
    .map((stream) => {
      const { title, channel, category, viewers, thumbnail, isLive } = stream;

      return `
        <article class="stream-card">
          <div class="thumb-wrapper">
            <img src="${thumbnail}" alt="${title}" />
            ${
              isLive
                ? '<span class="live-badge">LIVE</span>'
                : ''
            }
          </div>
          <div class="stream-info">
            <h3>${title}</h3>
            <p>${channel} • ${viewers} watching</p>
            <p>${category}</p>
          </div>
        </article>
      `;
    })
    .join('');

  streamsGrid.innerHTML = html;
}

// Filter buttons
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    currentFilter = btn.dataset.category;
    renderStreams();
  });
});

// Search input
searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value;
  renderStreams();
});

// Add-stream form
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = form.title.value.trim();
  const channel = form.channel.value.trim();
  const category = form.category.value;
  const thumbnail = form.thumbnail.value.trim();
  const viewers = Number(form.viewers.value) || 0;
  const isLive = form.isLive.checked;

  if (!title || !channel) return;

  streamsState.unshift({
    title,
    channel,
    category,
    viewers,
    thumbnail:
      thumbnail || 'https://via.placeholder.com/320x180?text=New+Stream',
    isLive,
  });

  form.reset();
  form.isLive.checked = true;

  renderStreams();
});

// initial render
renderStreams();