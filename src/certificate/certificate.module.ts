import { Module } from '@nestjs/common'
import { CertificateService } from './certificate.service'
import { CertificateController } from './certificate.controller'
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CourseEntity } from '../course/entity/course.entity'

@Module({
	imports: [TypeOrmModule.forFeature([CourseEntity]), UserModule],
	controllers: [CertificateController],
	providers: [CertificateService]
})
export class CertificateModule {}
