import React, { useState, useEffect, useRef } from 'react';

const CustomButton = () => {
  function rep() {
    document.body.innerHTML =
      document.body.innerHTML
      .replace(/Machine/g, '<span style="text-decoration: underline">Alien</span>');
  }

  return <button onClick={rep}>Custom button</button>
}

export default CustomButton