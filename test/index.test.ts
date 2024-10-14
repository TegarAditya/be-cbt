import { getMapelSubjectByKelas } from '@/handlers/mapel'
import { describe, expect, it } from 'bun:test'

describe('getMapelSubjectByKelas', () => {
    it('return a list of mapel subjects', async () => {
        const mapel = await getMapelSubjectByKelas('pts', 1, 'sd')

        expect(mapel).toContain('BTQ')
    })
})