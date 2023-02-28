# Enter your code here. Read input from STDIN. Print output to STDOUT
import re

n = int(input())

pattern = r'(?!.*(\d)\-?\1\-?\1\-?\1)^([4-6]\d{15}$|[4-6]\d{3}-\d{4}-\d{4}-\d{4}$)'

for i in range(n):
    card_number = input()
    if re.match(pattern, card_number):
        print("Valid")
    else:
        print("Invalid")
