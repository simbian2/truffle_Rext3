// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  uint storedData;
  event Change(string message, uint newVal);

  function set(uint x) public {
    storedData = x;
    emit Change("set",x);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
