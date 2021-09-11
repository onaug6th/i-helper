import path from 'path';
const apisdk = global.isDevMode ? path.join(process.cwd(), 'public', 'apisdk.js') : path.join(__dirname, 'apisdk.js');

const scrollbarCSS = `
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}

::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.4);
}

::-webkit-scrollbar-track {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-track:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.06);
}`;

export { apisdk, scrollbarCSS };
