import type { CurrentUser } from '../types/auth'

const API_URL = 'http://127.0.0.1:8000'


export async function getCurrentUser(
  accessToken: string,
): Promise<CurrentUser> {
  const response = await fetch(
    `${API_URL}/api/me`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      'Không thể lấy thông tin người dùng',
    )
  }

  return response.json()
}