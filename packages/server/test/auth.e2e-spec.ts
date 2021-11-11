import { HttpStatus } from '@nestjs/common';
import { createRegisterDto } from './helpers/dto';

describe('AuthController (e2e)', () => {
  test('register', async () => {
    const response = await request.post('/auth/register').send(createRegisterDto());
    expect(response).toHaveStatus(HttpStatus.CREATED);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.books).toEqual([]);
  });

  test('login', async () => {
    const dto = createRegisterDto();
    let response = await request.post('/auth/register').send(dto);
    expect(response).toHaveStatus(HttpStatus.CREATED);

    response = await request.post('/auth/login').send({ username: dto.username, password: dto.password });
    expect(response).toHaveStatus(HttpStatus.OK);
  });
});
