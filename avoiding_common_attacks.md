
# Avoiding common attacks

## Re-Entrancy

used ReentrancyGuard contract from oppenzeppelin to prevent re-entrance to functions

## Using Specific Compiler Pragma 

I used 0.8.9 compiler 

## Proper use of .call and .delegateCall

I used call instead of transfer to send money to sellers in case of a buyer bought a listed item 