import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async createProfile(user: User): Promise<Profile> {
    const profile = this.profileRepository.create({
      user: user,
    })

    return this.profileRepository.save(profile);
  }

  async getProfileByUser(user: User): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { user: user } });

    if (!profile) {
      return await this.createProfile(user);
    }
    console.log(profile);
    return profile;
  }

  async saveProfile(profile: Profile): Promise<Profile> {
    return this.profileRepository.save(profile);
  }
}
