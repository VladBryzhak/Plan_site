#!/usr/bin/env python3
"""
Генерує іконки icon-192.png і icon-512.png для PWA.
Запусти: python3 generate_icons.py
Потім заміни на свої іконки якщо хочеш кастомний дизайн.
"""
import struct, zlib, math

def make_png(size):
    """Створює простий PNG з зеленим фоном і гантеллю."""
    img = []
    teal = (29, 158, 117)
    white = (255, 255, 255)

    for y in range(size):
        row = []
        for x in range(size):
            nx = (x / size) * 2 - 1
            ny = (y / size) * 2 - 1

            # Кругла іконка (маска)
            in_circle = (nx**2 + ny**2) <= 1.0

            if not in_circle:
                row.extend([0, 0, 0, 0])  # прозорий
                continue

            # Малюємо просту гантель
            # Ліва гиря
            lx, ly, lr = -0.55, 0.0, 0.22
            # Права гиря
            rx, ry, rr = 0.55, 0.0, 0.22
            # Ручка
            bar_y = 0.07

            in_left  = ((nx - lx)**2 + (ny - ly)**2) <= lr**2
            in_right = ((nx - rx)**2 + (ny - ry)**2) <= rr**2
            in_bar   = abs(ny) <= bar_y and abs(nx) <= 0.55

            if in_left or in_right or in_bar:
                row.extend([white[0], white[1], white[2], 255])
            else:
                row.extend([teal[0], teal[1], teal[2], 255])

        img.append(bytes([0] + row))  # filter byte

    def chunk(name, data):
        c = struct.pack('>I', len(data)) + name + data
        return c + struct.pack('>I', zlib.crc32(name + data) & 0xffffffff)

    signature = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    idat_data = zlib.compress(b''.join(img))

    return (signature +
            chunk(b'IHDR', ihdr_data) +
            chunk(b'IDAT', idat_data) +
            chunk(b'IEND', b''))

import os
os.makedirs('icons', exist_ok=True)

for size in [192, 512]:
    with open(f'icons/icon-{size}.png', 'wb') as f:
        f.write(make_png(size))
    print(f'✓ icons/icon-{size}.png створено')

print('\nГотово! Іконки збережено в папку icons/')
print('Підказка: можеш замінити їх на власний дизайн через https://realfavicongenerator.net')
