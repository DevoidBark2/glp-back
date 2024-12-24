import { Html } from '@react-email/html'
import { Heading, Link, Body, Text } from '@react-email/components'
import * as React from 'react'
interface ResetPasswordTemplateProps {
	domain: string
	token: string
}
export function ResetPasswordTemplate({
	domain,
	token
}: ResetPasswordTemplateProps) {
	const resetLink = `${domain}/auth/new-password?token=${token}`

	return (
		<Html>
			<Body>
				<Heading>Сброс пароля</Heading>
				<Text>
					Привет, вы запросили сброс пароля, пройдите по ссылке ниже:
				</Text>
				<Link href={resetLink}>Подтвердить сброс пароля</Link>

				<Text>
					Эта ссылка десвтйительна 1 час, если это не вы, просто игнор
				</Text>
			</Body>
		</Html>
	)
}
