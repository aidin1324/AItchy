import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем размеры холста
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Star[] = [];
    const starCount = 50; // Уменьшено количество звёзд

    // Инициализация звёзд
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      // Очистка холста
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Рисуем звёзды с сиянием
      stars.forEach((star) => {
        // Создание градиента для сияния
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3 // Увеличено значение для более выраженного сияния
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Центр звезды
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)'); // Полутона
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Края

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Обновляем координаты звезды
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = canvas.width; // Переместить звезду обратно справа
          star.y = Math.random() * canvas.height; // Установить случайную высоту
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Обработка изменения размера окна
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Удаление обработчика при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default StarryBackground;
