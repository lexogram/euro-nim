/** adusts.js **
 *  
 * The logic for winning at Nim requires you to remove items to create
 * an even number of groups of 4 items, 2 items and 1 item. The
 * opening position is just such a winning position, with 2 groups of
 * 4, 2 groups of 2 and 4 groups of 1
 *  
 * 1
 * 1 11
 * 1    1111
 * 1 11 1111
 *  
 * Against a player who knows the logic (like the AI), the first
 * player to remove an item will lose.
 *
 * This file includes data on how to move items in any given row into
 * groups of 4, 2 and 1 items, and how to select from such groupings
 * to maintain the 4-2-1 grouping.
 *  
 * Property numbers are decimal representations of binary numbers:
 * E.g. 127 represents 1111111: one item in each place in the row of
 * 7 items.
 *  
 * Numbers with only one bit (64, 32, 16, 8, 4, 2 and 1) are missing
 * because
 * a) They are already correctly grouped
 * b) Removing an(y number of) item(s) from the row empties the row
 *  
 * Values are either:
 * • An array of two numbers
 * • A map object
 * • An array with two numbers plus a map object in the last place
 *   (31 and 7 only)
 *  
 * ARRAYS
 * ——————
 * The first number in an array indicates how to move items so that
 * they appear in 4-2-1 groups. The number has the format [TF]+,
 * where F = "move the item From this index..." and T = "... To this
 * new index"
 *  
 * The number will be read in and treated digit by digit from right
 * to left.  
 *  
 * The second number in an array is the value that will be created by
 * the movement indicated by the first number.
 *  
 * For example: 29: [21, 30] means "When you have items in slots 11101
 * (the binary representation of 29) then shift the item in slot 1
 * (on the right) to slot 2 (second from the right), to give 11110,
 * which has the decimal value 30"
 *  
 * MAPS
 * ————
 * A map has the format:
 * { <integer number of items to remove>:  
 *                   <binary representation of which items to remove>  
 * , ... }
 *  
 * Maps are only given for number that represent items in a 4-2-1
 * grouping (with 127 being the only case where such a grouping
 * contains no gaps).
 *  
 * For example: 30: {1: 4, 2: 24, 3: 14} means: "When you have items
 * grouped as 11110, and you need to remove one item, take number 4
 * (100) which will give 11010, which is still has a 4-2-1 grouping.
 * For 2 items, take 24 (11000) to leave 00110; for 3 items, take 14
 * (1100) to leave 10000. If you need to remove 4 items, take 30 (the
 * number you first thought of) to leave 00000."
 *  
 * ARRAYS with a MAP
 * —————————————————
 * The numbers 127, 31, 7 and 1 can arise in two ways:
 * * As part of the initial layout of the rows
 * * As the result of items being taken from the row of 7 (or the row
 *   of 5).
 * In the first instance, the map provides information on how to
 * remove items from the row. In the second instance, the first two
 * entries in the array explain how to move the leftmost item right
 * to create a 4-2-1 grouping.
**/


export const adjusts = {  
    127: [{1: 16, 2: 48, 3: 112, 4: 60, 5: 124, 6: 63}]
  , 126: [2312, 123]
  , 125: [23, 123]
  , 124: [23, 121]
  , 123: {1: 2, 2: 3, 3: 26, 4: 120, 5: 59}
  , 122: {1: 2, 2: 24, 3: 26, 4: 120}
  , 121: {1: 1, 2: 24, 3: 25, 4: 120}
  , 120: {1: 32, 2: 24, 3: 56}
  , 119: [45, 111]
  , 118: [43, 122]
  , 117: [43, 121]
  , 116: [43, 120]
  , 115: [42, 121]
  , 114: [42, 120]
  , 113: [41, 120]
  , 112: [5645, 104]
  , 111: {1: 32, 2: 96, 3: 14, 4: 15, 5: 47}
  , 110: [65, 94]
  , 109: [4354, 121]
  , 108: [4354, 120]
  , 107: [4634, 79]
  , 106: [4254, 120]
  , 105: [4154, 120]
  , 104: {1: 8, 2: 96}
  , 103: [46, 79]
  , 102: [4253, 120]
  , 101: [4153, 120]
  , 100: {1: 4, 2: 96}
  ,  99: [4152, 120]
  ,  98: {1: 2, 2: 96}
  ,  97: {1: 1, 2: 96}
  ,  96: {1: 32}
  ,  95: [65, 111]
  ,  94: {1: 64, 2: 24, 3: 88, 4: 30}
  ,  93: [21, 94]
  ,  92: [67, 60]
  ,  91: [4534, 79]
  ,  90: [6732, 60]
  ,  89: [6731, 60]
  ,  88: {1: 64, 2: 24}
  ,  87: [45, 79]
  ,  86: [5745, 30]
  ,  85: [473523, 15]
  ,  84: [45, 88]
  ,  83: [4735, 15]
  ,  82: [65, 98]
  ,  81: [65, 97]
  ,  80: [65, 96]
  ,  79: {1: 64, 2: 12, 3: 76, 4: 15}
  ,  78: [57, 30]
  ,  77: [5721, 30]
  ,  76: {1: 64, 2: 12}
  ,  75: [4734, 15]
  ,  74: [34, 70]
  ,  73: [24, 67]
  ,  72: [64, 96]
  ,  71: [47, 15]
  ,  70: {1: 64, 2: 6}
  ,  69: [23, 67]
  ,  68: [63, 96]
  ,  67: {1: 64, 2: 3}
  ,  66: [62, 96]
  ,  65: [61, 96]

  ,  63: [6576, 111]
  ,  62: [76, 94]
  ,  61: {1: 1, 2: 12, 3: 13, 4: 60}
  ,  60: {1: 16, 2:48, 3: 28}
  ,  59: [32, 61]
  ,  58: [32, 60]
  ,  57: [31, 60]
  ,  56: [76, 88]
  ,  55: [45, 47]
  ,  54: [3243, 60]
  ,  53: [3143, 60]
  ,  52: {1: 4, 2: 48}
  ,  51: [4635, 15]
  ,  50: {1: 2, 2: 48}
  ,  49: {1: 1, 2: 48}
  ,  48: {1: 16}
  ,  47: {1: 32, 2: 12, 3: 44, 4: 15}
  ,  46: [56, 30]
  ,  45: [5621, 30]
  ,  44: {1: 32, 2: 12}
  ,  43: [4634, 15]
  ,  42: [34, 38]
  ,  41: [54, 49]
  ,  40: [54,48]
  ,  39: [64, 15]
  ,  38: {1: 32, 2: 6}
  ,  37: [23, 35]
  ,  36: [46, 12]
  ,  35: {1: 32, 2: 3}
  ,  34: [36, 6]
  ,  33: [26, 3]

  ,  31: [65, 47, {1: 16, 2: 12, 3: 28, 4: 15}]
  ,  30: {1: 4, 2: 24, 3: 14}
  ,  29: [21, 30]
  ,  28: [23, 262]
  ,  27: [4534, 15]
  ,  26: {1: 2, 2: 24}
  ,  25: {1: 1, 2: 24}
  ,  24: {1: 8}
  ,  23: [45, 15]
  ,  22: {1: 16, 2: 6}
  ,  21: [23, 19]
  ,  20: [43, 24]
  ,  19: {1: 16, 2: 3}
  ,  18: [42, 24]
  ,  17: [25, 3]

  ,  15: {1: 4,2: 12, 3: 14}
  ,  14: [12, 13]  
  ,  13: {1: 1, 2: 12}
  ,  12: {1: 4}
  ,  11: {1: 8, 2: 3}
  ,  10: [34, 6]
  ,   9: [24, 3]

  ,   7: [43, 11, {1: 4, 2: 3}]
  ,   6: {1: 4}
  ,   5: [21, 3]

  ,   3: {1: 2}

  ,   1: [{}]
  }