import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { Body } from '@react-email/body'
import { Link } from '@react-email/link'
import { Heading } from '@react-email/heading'
import * as React from 'react'
interface ConfirmationTemplateProps {
	domain: string
	token: string
}
export function ConfirmationTemplate({
	domain,
	token
}: ConfirmationTemplateProps) {
	const confirmLink = `${domain}/platform/auth/new-verification?token=${token}`

	return (
		<Html>
			<Body>
				<Heading>Подтверждение почты</Heading>
				<Text>
					Привет, чтобы подвтерждить почту, пройдите по ссылке ниже:
				</Text>
				<Link href={confirmLink}>Подтвердить почту</Link>

				<Text>
					Эта ссылка десвтйительна 1 час, если это не вы, просто игнор
				</Text>
			</Body>
		</Html>
	)
}
